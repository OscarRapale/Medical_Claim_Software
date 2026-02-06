require "csv"

class CsvImportService
  REQUIRED_HEADERS = %w[
    patient_first_name
    patient_last_name
    patient_dob
    claim_number
    service_date
    amount
    status
  ].freeze

  VALID_STATUSES = %w[pending submitted denied paid].freeze

  def initialize(file, file_name)
    @file = file
    @file_name = file_name
    @errors = []
    @processed_count = 0
  end

  def call
    # Create the import record
    @claim_import = ClaimImport.create!(
      file_name: @file_name,
      total_records: 0,
      processed_records: 0,
      status: "pending"
    )

    begin
      process_csv
      @claim_import.update!(
        status: "completed",
        processed_records: @processed_count
      )
    rescue StandardError => e
      @claim_import.update!(status: "failed")
      @errors << "Import failed: #{e.message}"
    end

    {
      claim_import: @claim_import,
      processed_count: @processed_count,
      errors: @errors
    }
  end

  private

  def process_csv
    csv_content = @file.read
    csv = CSV.parse(csv_content, headers: true, header_converters: :symbol)

    # Validate headers
    validate_headers(csv.headers)
    return if @errors.any?

    # Update total records count
    @claim_import.update!(total_records: csv.count)

    # Process each row
    csv.each_with_index do |row, index|
      process_row(row, index + 2)
    end
  end

  def validate_headers(headers)
    headers_str = headers.map(&:to_s)
    missing = REQUIRED_HEADERS - headers_str

    if missing.any?
      @errors << "Missing required headers: #{missing.join(", ")}"
    end
  end

  def process_row(row, row_number)
    # Validate row data
    row_errors = validate_row(row, row_number)

    if row_errors.any?
      @errors.concat(row_errors)
      return
    end

    ActiveRecord::Base.transaction do
      # Find or create patient
      patient = find_or_create_patient(row)

      # Create claim
      create_claim(patient, row)

      @processed_count += 1
    end
  rescue ActiveRecord::RecordInvalid => e
    @errors << "Row #{row_number}: #{e.message}"
  rescue StandardError => e
    @errors << "Row #{row_number}: Unexpected error - #{e.message}"
  end

  def validate_row(row, row_number)
    errors = []

    # Check required fields
    if row[:patient_first_name].blank?
      errors << "Row #{row_number}: patient_first_name is required"
    end

    if row[:patient_last_name].blank?
      errors << "Row #{row_number}: patient_last_name is required"
    end

    if row[:patient_dob].blank?
      errors << "Row #{row_number}: patient_dob is required"
    elsif !valid_date?(row[:patient_dob])
      errors << "Row #{row_number}: patient_dob is not a valid date (use YYYY-MM-DD)"
    end

    if row[:claim_number].blank?
      errors << "Row #{row_number}: claim_number is required"
    end

    if row[:service_date].blank?
      errors << "Row #{row_number}: service_date is required"
    elsif !valid_date?(row[:service_date])
      errors << "Row #{row_number}: service_date is not a valid date (use YYYY-MM-DD)"
    end

    if row[:amount].blank?
      errors << "Row #{row_number}: amount is required"
    elsif !valid_decimal?(row[:amount])
      errors << "Row #{row_number}: amount is not a valid number"
    end

    if row[:status].blank?
      errors << "Row #{row_number}: status is required"
    elsif !VALID_STATUSES.include?(row[:status].downcase)
      errors << "Row #{row_number}: status must be one of: #{VALID_STATUSES.join(', ')}"
    end

    errors
  end

  def valid_date?(date_string)
    Date.parse(date_string)
    true
  rescue ArgumentError
    false
  end

  def valid_decimal?(value)
    Float(value)
    true
  rescue ArgumentError, TypeError
    false
  end

  def find_or_create_patient(row)
    Patient.find_or_create_by!(
      first_name: row[:patient_first_name].strip,
      last_name: row[:patient_last_name].strip,
      dob: Date.parse(row[:patient_dob])
    )
  end

  def create_claim(patient, row)
    Claim.create!(
      patient: patient,
      claim_import: @claim_import,
      claim_number: row[:claim_number].strip,
      service_date: Date.parse(row[:service_date]),
      amount: BigDecimal(row[:amount].to_s),
      status: row[:status].downcase.strip
    )
  end
end
class ClaimImportsController < ApplicationController
  
  # GET /claim_imports
  def index
    imports = ClaimImport.all.order(created_at: :desc)
    render json: imports.map { |import| import_json(import) }
  end

  # GET /claim_imports/:id
  def show
    import = ClaimImport.find(params[:id])
    render json: import_json(import, include_claims: true)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Import not found" }, status: :not_found
  end

  # POST /claim_imports
  def create
    unless params[:file].present?
      return render json: { error: "No file provided" }, status: :bad_request
    end

    file = params[:file]

    # Validate file type
    unless file.content_type == "text/csv" || file.original_filename.end_with?(".csv")
      return render json: { error: "File must be a CSV"}, status: :bad_request
    end

    # Store the file
    file_name = store_file(file)

    # Process the CSV
    service = CsvImportService.new(file, file_name)
    result = service.call

    render json: {
      claim_import: import_json(result[:claim_import]),
      processed_count: result[:processed_count],
      errors: result[:errors]
    }, status: result[:errors].empty? ? :created : :unprocessable_entity
  end

  private

  def store_file(file)
    # Create directory structure: /claims_uploads/imports/yyyy-mm-dd/
    date_folder = Date.current.strftime("%Y-%m-%d")
    upload_dir = Rails.root.join("claims_uploads", "imports", date_folder)
    FileUtils.mkdir_p(upload_dir)

    # Generate filename with timestamp
    timestamp = Time.current.strftime("%Y%m%d%H%M%S")
    file_name = "claims_import_#{timestamp}.csv"
    file_path = upload_dir.join(file_name)

    # Save the file
    File.open(file_path, "wb") do |f|
      f.write(file.read)
    end

    # Rewind the file so it can be read again by the service
    file.rewind

    file_name
  end

  def import_json(import, include_claims: false)
    json = {
      id: import.id,
      file_name: import.file_name,
      total_records: import.total_records,
      processed_records: import.processed_records,
      status: import.status,
      created_at: import.created_at
    }

    if include_claims
      json[:claims] = import.claims.includes(:patient).map do |claim|
        {
          id: claim.id,
          claim_number: claim.claim_number,
          patient_name: claim.patient.full_name,
          service_date: claim.service_date,
          amount: claim.amount.to_f,
          status: claim.status
        }
      end
    end

    json
  end
end
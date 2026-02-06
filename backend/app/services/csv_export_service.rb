require "csv"

class CsvExportService
  def initialize(claims = nil)
    @claims = claims || Claim.includes(:patient).all
  end

  def call
    CSV.generate(headers: true) do |csv|
      # Add headers
      csv << export_headers

      # Add data rows
      @claims.each do |claim|
        csv << export_row(claim)
      end
    end
  end

  def export_to_file
    # Create directory structure: /claims_uploads/exports/yyyy-mm-dd/
    date_folder = Date.current.strftime("%Y-%m-%d")
    export_dir = Rails.root.join("claims_upload", "exports", date_folder)
    FileUtils.mkdir_p(export_dir)

    # Generate filename with timestamp
    timestamp = Time.current.strftime("%Y%m%d%H%M%S")
    file_name = "claims_export_#{timestamp}.csv"
    file_path = export_dir.join(file_name)

    # Write CSV to file
    File.write(file_path, call)

    {
      file_name: file_name,
      file_path: file_path.to_s,
      records_count: @claims.count
    }
  end

  private

  def export_headers
    %w[claim_number patient_name service_date amount status]
  end

  def export_row(claim)
    [
      claim.claim_number,
      claim.patient.full_name,
      claim.service_date.strftime("%Y-%m-%d"),
      format("%.2f", claim.amount),
      claim.status
    ]
  end
end
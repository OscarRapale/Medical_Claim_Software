class ClaimsExportsController < ApplicationController
  # GET /claims/export
  def export
    # Get claims with optional filters
    claims = Claim.includes(:patient).order(created_at: :desc)

    # Optional filtering by status
    if params[:status].present?
      claims = claims.where(status: params[:status])
    end

    # Optional filtering by date range
    if params[:start_date].present?
      claims = claims.where("service_date >= ?", params[:start_date])
    end

    if params[:end_date].present?
      claims = claims.where("service_date <= ?", params[:end_date])
    end

    # Generate CSV
    service = CsvExportService.new(claims)
    csv_data = service.call

    # Send as downloadable file
    send_data csv_data,
              filename: "claims_export_#{Time.current.strftime("%Y%m%d%H%M%S")}.csv",
              type: "text/csv",
              disposition: "attachment"
  end
end
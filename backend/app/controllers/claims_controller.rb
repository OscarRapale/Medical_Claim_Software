class ClaimsController < ApplicationController
  before_action :set_claim, only: [:show, :update, :destroy]

  # GET /claims
  def index
    claims = Claim.includes(:patient).order(created_at: :desc)

    # Optional filtering by status
    if params[:status].present?
      claims claims.where(status: params[:status])
    end

    # Optional filtering by patient
    if params[:patient_id].present?
      claims = claims.where(patient_id: params[:patient_id])
    end

    render json: claims.map { |claim| claim_json(claim)}
  end

  # GET /claims/:id
  def show
    render json: claim_json(@claim, include_patient: true)
  end

  # POST /claims
  def create
    claim = Claim.new(claim_params)

    if claim.save
      render json: claim_json(claim), status: :created
    else
      render json: { errors: claim.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /claims/:id
  def update
    if @claim.update(claim_params)
      render json: claim_json(@claim)
    else
      render json: { errors: @claim.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /claims/:id
  def destroy
    @claim.destroy
    head :no_content
  end

  private

  def set_claim
    @claim = Claim.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Claim not found" }, status: :not_found
  end

  def claim_params
    params.permit(:patient_id, :claim_number, :service_date, :amount, :status, :claim_import_id)
  end

  def claim_json(claim, include_patient: false)
    json = {
      id: claim.id,
      claim_number: claim.claim_number,
      service_date: claim.service_date,
      amount: claim.amount.to_f,
      status: claim.status,
      patient_id: claim.patient_id,
      patient_name: claim.patient.full_name,
      claim_import_id: claim.claim_import_id,
      created_at: claim.created_at
    }

    if include_patient
      json[:patient] = {
        id: claim.patient.id,
        first_name: claim.patient.first_name,
        last_name: claim.patient.last_name,
        full_name: claim.patient.full_name,
        dob: claim.patient.dob
      }
    end

    json
  end
end

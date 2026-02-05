class PatientsController < ApplicationController
  before_action :set_patient, only: [:show, :update, :destroy]

  # GET /patients
  def index
    patients = Patient.all.order(created_at: :desc)
    render json: patients.map { |patient| patient_json(patient) }
  end

  # GET /patients/:id
  def show
    render json: patient_json(@patient, include_claims: true)
  end

  # POST /patients
  def created
    patient = Patient.new(patient_params)

    if patient.save
      render json: patient_json(patient), status: :created
    else
      render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /patients/:id
  def update
    if @patient.update(patient_params)
      render json: patient_json(@patient)
    else
      render json: { errors: @patient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /patients/:id
  def destroy
    @patient.destroy
    head :no_content
  end

  private

  def set_patient
    @patient = Patient.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Patient not found" }, status: :not_found
  end

  def patient_params
    params.permit(:first_name, :last_name, :dob)
  end

  def patient_json(patient, include_claims: false)
    json = {
      id: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      full_name: patient.full_name,
      dob: patient.dob,
      created_at: patient.created_at
    }

    if include_claims
      json[:claims] = patient.claims.map do |claim|
        {
          id: claim.id,
          claim_number: claim.claim_number,
          service_date: claim.service_date,
          amount: claim.amount,
          status: claim.status
        }
      end
    end

    json
  end
end

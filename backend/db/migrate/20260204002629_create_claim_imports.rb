class CreateClaimImports < ActiveRecord::Migration[7.0]
  def change
    create_table :claim_imports do |t|
      t.string :file_name
      t.integer :total_records
      t.integer :processed_records
      t.string :status

      t.timestamps
    end
  end
end

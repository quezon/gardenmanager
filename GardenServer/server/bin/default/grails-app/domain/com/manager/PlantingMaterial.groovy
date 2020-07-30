package com.manager

class PlantingMaterial {
	Integer materialId
	Plant plant
	String materialType
	String vendor
	Date dateAcquired
	Double cost
	Double qtyAcquired
	Double qtyUsed
	UnitOfMeasure unitOfMeasure
	Storage storage
	
    static constraints = {
		qtyAcquired nullable: true
		qtyUsed nullable: true
		cost validator: { val ->
			val >= 0
		}
		
		qtyAcquired validator: { val ->
			if (val == null) {
				return true
			}
	
			return val > 0.0
		}
		
		qtyUsed validator: { val, obj ->
			val <= obj.qtyAcquired
		}
    }
	
	static mapping = {
		dateAcquired defaultValue: "now()"
		id generator: 'sequence',
		   name: 'materialId'
	}
}

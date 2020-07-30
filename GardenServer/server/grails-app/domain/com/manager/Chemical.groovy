package com.manager

class Chemical {
    String tradeName
	String manufacturer
	String photo64
	Date dateAcquired
	Double cost
	Double qtyAcquired
	Double qtyUsed
	UnitOfMeasure unitOfMeasure
	Storage storage

	
    static constraints = {
		cost validator: { val ->
			val >= 0
		}
		
		qtyAcquired validator: { val ->
			val > 0.0
		}
		
		qtyUsed validator: { val, obj ->
			val <= obj.qtyAcquired
		}
    }
	
	static mapping = {
		photo64 sqlType:'text'
		dateAcquired defaultValue: "now()"
	}
	
	def beforeInsert() {
		return qtyAcquired >= qtyUsed
	}
	
	def beforeUpdate() {
		this.dirtyPropertyNames.each { String fieldName ->
			if (fieldName == "qtyUsed") {
				def newQtyUsed = this.getProperty(fieldName)
				return qtyAcquired >= newQtyUsed
			}
			
			if (fieldName == "qtyAcquired") {
				def newQtyAcquired = this.getProperty(fieldName)
				return newQtyAcquired >= qtyUsed
			}
		}
	}
}

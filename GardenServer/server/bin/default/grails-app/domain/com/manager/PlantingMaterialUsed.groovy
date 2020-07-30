package com.manager

class PlantingMaterialUsed {
	PlantingMaterial pm
	Double qtyUsed
	Double qtyTransformed
	
    static constraints = {
		qtyUsed validator: { val, obj ->
			return val <= obj.pm.qtyAcquired - obj.pm.qtyUsed && val > 0
		}
		qtyTransformed min: 0.0
		qtyTransformed validator: { val, obj ->
			return val <= obj.qtyUsed
		}
    }
	
	def beforeInsert() {
		def balance = pm.qtyAcquired - pm.qtyUsed
		return qtyUsed <= balance
	}
	
	def beforeUpdate() {
		this.dirtyPropertyNames.each { String fieldName ->
			if (fieldName == "qtyUsed") {
				def oldValue = this.getPersistentValue(fieldName)
				def newValue = this.getProperty(fieldName)
				def balance = pm.qtyAcquired - pm.qtyUsed + oldValue
				
				return newValue <= balance
			}
		}
	}
	
	def afterInsert() {
		pm.qtyUsed += qtyUsed
	}
	
	def afterUpdate() {
		pm.qtyUsed += qtyUsed
	}
}
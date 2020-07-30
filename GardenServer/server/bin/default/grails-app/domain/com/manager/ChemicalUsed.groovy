package com.manager

class ChemicalUsed {
    Chemical chem
	Double qtyUsed
	
	def beforeInsert() {
		def balance = chem.qtyAcquired - chem.qtyUsed
		return qtyUsed <= balance 
	}
	
	def beforeUpdate() {
		this.dirtyPropertyNames.each { String fieldName ->
			if (fieldName == "qtyUsed") {
				def oldValue = this.getPersistentValue(fieldName)
				def newValue = this.getProperty(fieldName)
				def balance = chem.qtyAcquired - chem.qtyUsed + oldValue
				
				return newValue <= balance			
			}
		}
	}
	
	def afterInsert() {
		chem.qtyUsed += qtyUsed
	}
	
	def afterUpdate() {
		chem.qtyUsed += qtyUsed
	}
	
	//static transients=['chemicalService']
    static constraints = {
    }
}

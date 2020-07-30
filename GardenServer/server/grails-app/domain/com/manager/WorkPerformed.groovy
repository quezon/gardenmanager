package com.manager

class WorkPerformed {
	String performedBy
	String checkedBy
	String workType
	Date startDateTime
	Date endDateTime
	List plantingMaterialsUsed
	List chemicalsUsed
	Set gardenToolsUsed
	
	
	static embedded = ['workDuration']
	static hasMany = [plantingMaterialsUsed: PlantingMaterialUsed,
		chemicalsUsed: ChemicalUsed, gardenToolsUsed: GardenTool
	]
    static constraints = {
		workType inList: ["weeding", "sowing", "rooting", "transplanting", 
			"fertilizing", "watering", "harvesting", "disposal", "digging", "tilling", "planting"]
		plantingMaterialsUsed nullable: true
		chemicalsUsed nullable: true
		gardenToolsUsed nullable: true
    }
}

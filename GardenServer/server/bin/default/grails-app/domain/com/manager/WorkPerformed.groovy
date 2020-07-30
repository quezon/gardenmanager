package com.manager

class WorkPerformed {
	String performedBy
	String checkedBy
	String workType
	Period workDuration
	List plantingMaterialsUsed
	List chemicalsUsed
	SortedSet gardenToolsUsed
	
	
	static embedded = ['workDuration']
	static hasMany = [plantingMaterialsUsed: PlantingMaterialUsed,
		chemicalsUsed: ChemicalUsed, gardenToolsUsed: GardenTool
	]
    static constraints = {
		workType inList: ["weeding", "sowing", "rooting", "transplanting", 
			"fertilizing", "watering", "harvesting", "disposal", "digging", "tilling"]
    }
}

package com.manager

class PlantingCycle {
	Plant plant
	Period cycleDuration
	List workDone
	
	static embedded = ['cycleDuration']
	static hasMany = [workDone: WorkPerformed]
    static constraints = {
    }
}

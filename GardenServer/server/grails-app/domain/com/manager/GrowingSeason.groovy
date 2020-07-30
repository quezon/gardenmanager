package com.manager

class GrowingSeason {
	String USDAZone
	Set months
	Plant plant
	
	static hasMany = [months: String]
    static constraints = {
    }

    static mapping = {
    }
}

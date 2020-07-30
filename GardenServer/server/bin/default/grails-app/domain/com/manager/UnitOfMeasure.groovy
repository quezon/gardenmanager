package com.manager

class UnitOfMeasure {
	String baseUnit
	String measureType
	String symbol
		
    static constraints = {
		baseUnit blank: false
		measureType blank: false
		symbol blank: false
    }
}

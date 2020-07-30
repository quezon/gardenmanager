package com.manager

class GardenTool {
	Integer toolId
    String toolName
	String photo64
	Date dateAcquired
	Double cost
	Storage storage
	
    static constraints = {
    }
	
	static mapping = {
		photo64 sqlType:'text'
		dateAcquired defaultValue: "now()"
		id generator: 'sequence',
		   name: 'toolId'
	}
}

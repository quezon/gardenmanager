package com.manager

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

//import grails.converters.deep.JSON
import grails.converters.JSON

@ReadOnly
class ChemicalController {

    ChemicalService chemicalService
	
    static responseFormats = ['json','xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond chemicalService.list(params), model:[chemicalCount: chemicalService.count()]
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond chemicalService.list(params), model:[chemicalCount: chemicalService.count()]
	}

    def show(Long id) {
        respond chemicalService.get(id)
    }

    @Transactional
    def save(Chemical chemical) {
		print params
        if (chemical == null) {
            render status: NOT_FOUND
            return
        }
        if (chemical.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond chemical.errors
            return
        }

        try {
            chemicalService.save(chemical)
        } catch (ValidationException e) {
            respond chemical.errors
            return
        }

        respond chemical, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Chemical chemical) {
        if (chemical == null) {
            render status: NOT_FOUND
            return
        }
        if (chemical.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond chemical.errors
            return
        }

        try {
            chemicalService.save(chemical)
        } catch (ValidationException e) {
            respond chemical.errors
            return
        }

        respond chemical, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        chemicalService.delete(id)

        render status: NO_CONTENT
    }
}

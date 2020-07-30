package com.manager

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class UnitOfMeasureController {

    UnitOfMeasureService unitOfMeasureService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
        respond unitOfMeasureService.list(params), model:[unitOfMeasureCount: unitOfMeasureService.count()]
		//render(view: "select", model: "")
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
		println request
		if (params.select == true) {
			render(view: "select") 
		}
        respond unitOfMeasureService.list(params), model:[unitOfMeasureCount: unitOfMeasureService.count()]
    }

    def show(Long id) {
        respond unitOfMeasureService.get(id)
    }

    @Transactional
    def save(UnitOfMeasure unitOfMeasure) {
        if (unitOfMeasure == null) {
            render status: NOT_FOUND
            return
        }
        if (unitOfMeasure.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond unitOfMeasure.errors
            return
        }

        try {
            unitOfMeasureService.save(unitOfMeasure)
        } catch (ValidationException e) {
            respond unitOfMeasure.errors
            return
        }

        respond unitOfMeasure, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(UnitOfMeasure unitOfMeasure) {
        if (unitOfMeasure == null) {
            render status: NOT_FOUND
            return
        }
        if (unitOfMeasure.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond unitOfMeasure.errors
            return
        }

        try {
            unitOfMeasureService.save(unitOfMeasure)
        } catch (ValidationException e) {
            respond unitOfMeasure.errors
            return
        }

        respond unitOfMeasure, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        unitOfMeasureService.delete(id)

        render status: NO_CONTENT
    }
}

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
class PlantController {

    PlantService plantService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond plantService.list(params), model:[plantCount: plantService.count()]
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond plantService.list(params), model:[plantCount: plantService.count()]
    }

    def show(Long id) {
        respond plantService.get(id)
    }

    @Transactional
    def save(Plant plant) {
        if (plant == null) {
            render status: NOT_FOUND
            return
        }
        if (plant.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plant.errors
            return
        }

        try {
            plantService.save(plant)
        } catch (ValidationException e) {
            respond plant.errors
            return
        }

        respond plant, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Plant plant) {
        if (plant == null) {
            render status: NOT_FOUND
            return
        }
        if (plant.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plant.errors
            return
        }

        try {
            plantService.save(plant)
        } catch (ValidationException e) {
            respond plant.errors
            return
        }

        respond plant, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        plantService.delete(id)

        render status: NO_CONTENT
    }
}

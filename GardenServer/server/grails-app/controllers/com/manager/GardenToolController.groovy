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
class GardenToolController {

    GardenToolService gardenToolService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond gardenToolService.list(params), model:[gardenToolCount: gardenToolService.count()]
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond gardenToolService.list(params), model:[gardenToolCount: gardenToolService.count()]
    }

    def show(Long id) {
        respond gardenToolService.get(id)
    }

    @Transactional
    def save(GardenTool gardenTool) {
        if (gardenTool == null) {
            render status: NOT_FOUND
            return
        }
        if (gardenTool.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond gardenTool.errors
            return
        }

        try {
            gardenToolService.save(gardenTool)
        } catch (ValidationException e) {
            respond gardenTool.errors
            return
        }

        respond gardenTool, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GardenTool gardenTool) {
        if (gardenTool == null) {
            render status: NOT_FOUND
            return
        }
        if (gardenTool.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond gardenTool.errors
            return
        }

        try {
            gardenToolService.save(gardenTool)
        } catch (ValidationException e) {
            respond gardenTool.errors
            return
        }

        respond gardenTool, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        gardenToolService.delete(id)

        render status: NO_CONTENT
    }
}

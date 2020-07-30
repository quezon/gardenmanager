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
class PlantingMaterialController {

    PlantingMaterialService plantingMaterialService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond plantingMaterialService.list(params), model:[plantingMaterialCount: plantingMaterialService.count()]
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond plantingMaterialService.list(params), model:[plantingMaterialCount: plantingMaterialService.count()]
    }

    def show(Long id) {
        respond plantingMaterialService.get(id)
    }

    @Transactional
    def save(PlantingMaterial plantingMaterial) {
        if (plantingMaterial == null) {
            render status: NOT_FOUND
            return
        }
        if (plantingMaterial.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plantingMaterial.errors
            return
        }

        try {
            plantingMaterialService.save(plantingMaterial)
        } catch (ValidationException e) {
            respond plantingMaterial.errors
            return
        }

        respond plantingMaterial, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PlantingMaterial plantingMaterial) {
        if (plantingMaterial == null) {
            render status: NOT_FOUND
            return
        }
        if (plantingMaterial.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plantingMaterial.errors
            return
        }

        try {
            plantingMaterialService.save(plantingMaterial)
        } catch (ValidationException e) {
            respond plantingMaterial.errors
            return
        }

        respond plantingMaterial, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        plantingMaterialService.delete(id)

        render status: NO_CONTENT
    }
}

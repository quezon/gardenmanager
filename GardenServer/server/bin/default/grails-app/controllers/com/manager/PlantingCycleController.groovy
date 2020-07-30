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
class PlantingCycleController {

    PlantingCycleService plantingCycleService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond plantingCycleService.list(params), model:[plantingCycleCount: plantingCycleService.count()]
    }

    def show(Long id) {
        respond plantingCycleService.get(id)
    }

    @Transactional
    def save(PlantingCycle plantingCycle) {
        if (plantingCycle == null) {
            render status: NOT_FOUND
            return
        }
        if (plantingCycle.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plantingCycle.errors
            return
        }

        try {
            plantingCycleService.save(plantingCycle)
        } catch (ValidationException e) {
            respond plantingCycle.errors
            return
        }

        respond plantingCycle, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PlantingCycle plantingCycle) {
        if (plantingCycle == null) {
            render status: NOT_FOUND
            return
        }
        if (plantingCycle.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond plantingCycle.errors
            return
        }

        try {
            plantingCycleService.save(plantingCycle)
        } catch (ValidationException e) {
            respond plantingCycle.errors
            return
        }

        respond plantingCycle, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        plantingCycleService.delete(id)

        render status: NO_CONTENT
    }
}

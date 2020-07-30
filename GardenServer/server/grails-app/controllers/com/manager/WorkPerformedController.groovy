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
class WorkPerformedController {

    WorkPerformedService workPerformedService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond workPerformedService.list(params), model:[workPerformedCount: workPerformedService.count()]
    }

    def show(Long id) {
        respond workPerformedService.get(id)
    }

    @Transactional
    def save(WorkPerformed workPerformed) {

        if (workPerformed == null) {
            render status: NOT_FOUND
            return
        }
        if (workPerformed.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond workPerformed.errors
            return
        }

        try {
            workPerformedService.save(workPerformed)
        } catch (ValidationException e) {
            respond workPerformed.errors
            return
        }

        respond workPerformed, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(WorkPerformed workPerformed) {
        if (workPerformed == null) {
            render status: NOT_FOUND
            return
        }
        if (workPerformed.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond workPerformed.errors
            return
        }

        try {
            workPerformedService.save(workPerformed)
        } catch (ValidationException e) {
            respond workPerformed.errors
            return
        }

        respond workPerformed, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        workPerformedService.delete(id)

        render status: NO_CONTENT
    }
}

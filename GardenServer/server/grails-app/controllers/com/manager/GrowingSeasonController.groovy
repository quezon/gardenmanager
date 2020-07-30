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
class GrowingSeasonController {

    GrowingSeasonService growingSeasonService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond growingSeasonService.list(params), model:[growingSeasonCount: growingSeasonService.count()]
    }

    def show(Long id) {
        respond growingSeasonService.get(id)
    }

    @Transactional
    def save(GrowingSeason growingSeason) {
        if (growingSeason == null) {
            render status: NOT_FOUND
            return
        }
        if (growingSeason.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond growingSeason.errors
            return
        }

        try {
            growingSeasonService.save(growingSeason)
        } catch (ValidationException e) {
            respond growingSeason.errors
            return
        }

        respond growingSeason, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrowingSeason growingSeason) {
        if (growingSeason == null) {
            render status: NOT_FOUND
            return
        }
        if (growingSeason.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond growingSeason.errors
            return
        }

        try {
            growingSeasonService.save(growingSeason)
        } catch (ValidationException e) {
            respond growingSeason.errors
            return
        }

        respond growingSeason, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        growingSeasonService.delete(id)

        render status: NO_CONTENT
    }
}

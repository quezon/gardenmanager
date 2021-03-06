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
class ChemicalUsedController {

    ChemicalUsedService chemicalUsedService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond chemicalUsedService.list(params), model:[chemicalUsedCount: chemicalUsedService.count()]
    }

    def show(Long id) {
        respond chemicalUsedService.get(id)
    }

    @Transactional
    def save(ChemicalUsed chemicalUsed) {
        if (chemicalUsed == null) {
            render status: NOT_FOUND
            return
        }
        if (chemicalUsed.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond chemicalUsed.errors
            return
        }

        try {
			chemicalUsedService.save(chemicalUsed)
        } catch (ValidationException e) {
            respond chemicalUsed.errors
            return
        }

        respond chemicalUsed, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ChemicalUsed chemicalUsed) {
        if (chemicalUsed == null) {
            render status: NOT_FOUND
            return
        }
        if (chemicalUsed.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond chemicalUsed.errors
            return
        }

        try {
            chemicalUsedService.save(chemicalUsed)
        } catch (ValidationException e) {
            respond chemicalUsed.errors
            return
        }

        respond chemicalUsed, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        chemicalUsedService.delete(id)

        render status: NO_CONTENT
    }
}

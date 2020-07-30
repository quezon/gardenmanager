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
class StorageController {

    StorageService storageService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

	def select(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond storageService.list(params), model:[storageService: storageService.count()]
	}
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond storageService.list(params), model:[storageCount: storageService.count()]
    }

    def show(Long id) {
        respond storageService.get(id)
    }

    @Transactional
    def save(Storage storage) {
        if (storage == null) {
            render status: NOT_FOUND
            return
        }
        if (storage.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond storage.errors
            return
        }

        try {
            storageService.save(storage)
        } catch (ValidationException e) {
            respond storage.errors
            return
        }

        respond storage, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Storage storage) {
        if (storage == null) {
            render status: NOT_FOUND
            return
        }
        if (storage.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond storage.errors
            return
        }

        try {
            storageService.save(storage)
        } catch (ValidationException e) {
            respond storage.errors
            return
        }

        respond storage, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        storageService.delete(id)

        render status: NO_CONTENT
    }
}

package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class StorageServiceSpec extends Specification {

    StorageService storageService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Storage(...).save(flush: true, failOnError: true)
        //new Storage(...).save(flush: true, failOnError: true)
        //Storage storage = new Storage(...).save(flush: true, failOnError: true)
        //new Storage(...).save(flush: true, failOnError: true)
        //new Storage(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //storage.id
    }

    void "test get"() {
        setupData()

        expect:
        storageService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Storage> storageList = storageService.list(max: 2, offset: 2)

        then:
        storageList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        storageService.count() == 5
    }

    void "test delete"() {
        Long storageId = setupData()

        expect:
        storageService.count() == 5

        when:
        storageService.delete(storageId)
        sessionFactory.currentSession.flush()

        then:
        storageService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Storage storage = new Storage()
        storageService.save(storage)

        then:
        storage.id != null
    }
}

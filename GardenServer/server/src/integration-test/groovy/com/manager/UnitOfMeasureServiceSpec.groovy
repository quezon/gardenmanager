package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class UnitOfMeasureServiceSpec extends Specification {

    UnitOfMeasureService unitOfMeasureService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new UnitOfMeasure(...).save(flush: true, failOnError: true)
        //new UnitOfMeasure(...).save(flush: true, failOnError: true)
        //UnitOfMeasure unitOfMeasure = new UnitOfMeasure(...).save(flush: true, failOnError: true)
        //new UnitOfMeasure(...).save(flush: true, failOnError: true)
        //new UnitOfMeasure(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //unitOfMeasure.id
    }

    void "test get"() {
        setupData()

        expect:
        unitOfMeasureService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<UnitOfMeasure> unitOfMeasureList = unitOfMeasureService.list(max: 2, offset: 2)

        then:
        unitOfMeasureList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        unitOfMeasureService.count() == 5
    }

    void "test delete"() {
        Long unitOfMeasureId = setupData()

        expect:
        unitOfMeasureService.count() == 5

        when:
        unitOfMeasureService.delete(unitOfMeasureId)
        sessionFactory.currentSession.flush()

        then:
        unitOfMeasureService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        UnitOfMeasure unitOfMeasure = new UnitOfMeasure()
        unitOfMeasureService.save(unitOfMeasure)

        then:
        unitOfMeasure.id != null
    }
}

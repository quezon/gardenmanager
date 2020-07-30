package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ChemicalServiceSpec extends Specification {

    ChemicalService chemicalService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Chemical(...).save(flush: true, failOnError: true)
        //new Chemical(...).save(flush: true, failOnError: true)
        //Chemical chemical = new Chemical(...).save(flush: true, failOnError: true)
        //new Chemical(...).save(flush: true, failOnError: true)
        //new Chemical(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //chemical.id
    }

    void "test get"() {
        setupData()

        expect:
        chemicalService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Chemical> chemicalList = chemicalService.list(max: 2, offset: 2)

        then:
        chemicalList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        chemicalService.count() == 5
    }

    void "test delete"() {
        Long chemicalId = setupData()

        expect:
        chemicalService.count() == 5

        when:
        chemicalService.delete(chemicalId)
        sessionFactory.currentSession.flush()

        then:
        chemicalService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Chemical chemical = new Chemical()
        chemicalService.save(chemical)

        then:
        chemical.id != null
    }
}

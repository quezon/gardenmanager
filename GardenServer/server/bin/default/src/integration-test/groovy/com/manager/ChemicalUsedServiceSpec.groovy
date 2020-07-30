package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ChemicalUsedServiceSpec extends Specification {

    ChemicalUsedService chemicalUsedService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ChemicalUsed(...).save(flush: true, failOnError: true)
        //new ChemicalUsed(...).save(flush: true, failOnError: true)
        //ChemicalUsed chemicalUsed = new ChemicalUsed(...).save(flush: true, failOnError: true)
        //new ChemicalUsed(...).save(flush: true, failOnError: true)
        //new ChemicalUsed(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //chemicalUsed.id
    }

    void "test get"() {
        setupData()

        expect:
        chemicalUsedService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ChemicalUsed> chemicalUsedList = chemicalUsedService.list(max: 2, offset: 2)

        then:
        chemicalUsedList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        chemicalUsedService.count() == 5
    }

    void "test delete"() {
        Long chemicalUsedId = setupData()

        expect:
        chemicalUsedService.count() == 5

        when:
        chemicalUsedService.delete(chemicalUsedId)
        sessionFactory.currentSession.flush()

        then:
        chemicalUsedService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ChemicalUsed chemicalUsed = new ChemicalUsed()
        chemicalUsedService.save(chemicalUsed)

        then:
        chemicalUsed.id != null
    }
}

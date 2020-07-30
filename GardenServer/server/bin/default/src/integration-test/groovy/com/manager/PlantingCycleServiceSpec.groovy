package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PlantingCycleServiceSpec extends Specification {

    PlantingCycleService plantingCycleService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new PlantingCycle(...).save(flush: true, failOnError: true)
        //new PlantingCycle(...).save(flush: true, failOnError: true)
        //PlantingCycle plantingCycle = new PlantingCycle(...).save(flush: true, failOnError: true)
        //new PlantingCycle(...).save(flush: true, failOnError: true)
        //new PlantingCycle(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //plantingCycle.id
    }

    void "test get"() {
        setupData()

        expect:
        plantingCycleService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<PlantingCycle> plantingCycleList = plantingCycleService.list(max: 2, offset: 2)

        then:
        plantingCycleList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        plantingCycleService.count() == 5
    }

    void "test delete"() {
        Long plantingCycleId = setupData()

        expect:
        plantingCycleService.count() == 5

        when:
        plantingCycleService.delete(plantingCycleId)
        sessionFactory.currentSession.flush()

        then:
        plantingCycleService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        PlantingCycle plantingCycle = new PlantingCycle()
        plantingCycleService.save(plantingCycle)

        then:
        plantingCycle.id != null
    }
}

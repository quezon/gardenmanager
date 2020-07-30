package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PlantServiceSpec extends Specification {

    PlantService plantService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Plant(...).save(flush: true, failOnError: true)
        //new Plant(...).save(flush: true, failOnError: true)
        //Plant plant = new Plant(...).save(flush: true, failOnError: true)
        //new Plant(...).save(flush: true, failOnError: true)
        //new Plant(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //plant.id
    }

    void "test get"() {
        setupData()

        expect:
        plantService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Plant> plantList = plantService.list(max: 2, offset: 2)

        then:
        plantList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        plantService.count() == 5
    }

    void "test delete"() {
        Long plantId = setupData()

        expect:
        plantService.count() == 5

        when:
        plantService.delete(plantId)
        sessionFactory.currentSession.flush()

        then:
        plantService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Plant plant = new Plant()
        plantService.save(plant)

        then:
        plant.id != null
    }
}

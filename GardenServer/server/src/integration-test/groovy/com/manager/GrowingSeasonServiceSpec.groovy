package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrowingSeasonServiceSpec extends Specification {

    GrowingSeasonService growingSeasonService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrowingSeason(...).save(flush: true, failOnError: true)
        //new GrowingSeason(...).save(flush: true, failOnError: true)
        //GrowingSeason growingSeason = new GrowingSeason(...).save(flush: true, failOnError: true)
        //new GrowingSeason(...).save(flush: true, failOnError: true)
        //new GrowingSeason(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //growingSeason.id
    }

    void "test get"() {
        setupData()

        expect:
        growingSeasonService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrowingSeason> growingSeasonList = growingSeasonService.list(max: 2, offset: 2)

        then:
        growingSeasonList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        growingSeasonService.count() == 5
    }

    void "test delete"() {
        Long growingSeasonId = setupData()

        expect:
        growingSeasonService.count() == 5

        when:
        growingSeasonService.delete(growingSeasonId)
        sessionFactory.currentSession.flush()

        then:
        growingSeasonService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrowingSeason growingSeason = new GrowingSeason()
        growingSeasonService.save(growingSeason)

        then:
        growingSeason.id != null
    }
}

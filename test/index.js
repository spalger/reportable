/* eslint-env mocha */

import reportable, { mixin, factory } from '../'
import expect from 'expect.js'
import sinon from 'sinon'

describe('reportable', () => {
  describe('default export', () => {
    it('exports the mixin function', () => {
      expect(reportable).to.be(mixin)
    })
  })

  describe('mixin', () => {
    it('assigns the report and consumeReports', () => {
      const mixed = mixin({}, [
        'one',
        'two',
      ])

      expect(mixed).to.have.property('report')
      expect(mixed.report).to.be.an('object')
      expect(mixed.report.one).to.be.a('function')
      expect(mixed.report.two).to.be.a('function')

      expect(mixed).to.have.property('consumeReports')
      expect(mixed.consumeReports).to.be.a('function')
    })
  })

  describe('report object', () => {
    describe('#consumeReports', () => {
      it('throws for unknown report names', () => {
        const report = factory(['foo', 'bar'])
        expect(() => {
          report.consumeReports({
            foobar() {},
          })
        }).to.throwError(/foobar/)
      })

      it('binds to repors', () => {
        const obj = factory(['foobar'])
        const stub1 = sinon.stub()
        const stub2 = sinon.stub()

        obj.consumeReports({
          foobar: stub1,
        })

        obj.report.foobar()

        sinon.assert.calledOnce(stub1)

        obj.consumeReports({
          foobar: stub2,
        })

        obj.report.foobar()

        sinon.assert.calledTwice(stub1)
        sinon.assert.calledOnce(stub2)
      })
    })

    describe('report', () => {
      it('calls report consumers with arguments', () => {
        const obj = factory(['foobar'])
        const stub1 = sinon.stub()
        obj.consumeReports({ foobar: stub1 })
        obj.report.foobar(1, 2, 345)

        sinon.assert.calledOnce(stub1)
        sinon.assert.calledWithExactly(stub1, 1, 2, 345)
      })
    })
  })
})

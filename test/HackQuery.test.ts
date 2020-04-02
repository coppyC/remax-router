import HackQuery from '../src/HackQuery'

describe('number type', () => {
  it('int type', () => {
    const originalQuery = { n: 1 }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('n=1')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('float type', () => {
    const originalQuery = { n: 1.1 }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('n=1.1')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('NaN type', () => {
    const originalQuery = { n: NaN }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('n=NaN')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('Infinity type', () => {
    const originalQuery = { n: Infinity }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('n=Infinity')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual({ n: Infinity })
  })
  it('negative type', () => {
    const originalQuery = { n: -1 }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('n=-1')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
})

describe('encode & decode', () => {
  it('key with encode', () => {
    const originalQuery = { '/': 1 }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe(`${encodeURIComponent('/')}=1`)
    const query = HackQuery.parse(queryStr)
    expect(Object.keys(query)).toEqual(['/'])
  })
  it('value with encode', () => {
    const originalQuery = { a: '/' }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe(`a=${encodeURIComponent('/')}`)
    const query = HackQuery.parse(queryStr)
    expect(query.a).toEqual('/')
  })
})

describe('string type', () => {
  it('stringify and parse correct', () => {
    const originalQuery = { x: 'a', y: '' }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=a&y=')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual({ x: 'a', y: '' })
  })
  it('version number string', () => {
    const originalQuery = { x: '1.1.1' }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=1.1.1')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('like a number but not a number', () => {
    const originalQuery = { x: '13822223333' }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe(`x='13822223333'`)
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
})

describe('boolean type', () => {
  it('true type', () => {
    const originalQuery = { x: true }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=true')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('false type', () => {
    const originalQuery = { x: false }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=false')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
})

describe('null type', () => {
  it('null', () => {
    const originalQuery = { x: null }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=null')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
  it('undefined', () => {
    const originalQuery = { x: undefined }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toBe('x=undefined')
    const query = HackQuery.parse(queryStr)
    expect(query).toEqual(originalQuery)
  })
})

describe('hack type default value', () => {
  it('function type', () => {
    const originalQuery = { onCall() {} }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toMatchSnapshot()
    const query = HackQuery.parse(queryStr)
    expect(typeof query.onCall).toBe('function')
  })
  it('symbol', () => {
    const originalQuery = { x: Symbol() }
    const queryStr = HackQuery.stringify(originalQuery)
    expect(queryStr).toMatchSnapshot()
    const query = HackQuery.parse(queryStr)
    expect(typeof query.x).toBe('symbol')
  })
})

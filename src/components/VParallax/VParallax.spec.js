import { test } from '@util/testing'
import VParallax from '@components/VParallax'

test('VParallax.js', ({ mount }) => {
  it('should render', async () => {
    const wrapper = mount(VParallax, {
      attachToDocument: true
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should use alt tag when supplied', async () => {
    const wrapper = mount(VParallax, {
      attachToDocument: true,
      propsData: {
        alt: 'name'
      }
    })

    const img = wrapper.find('img')[0]
    expect(img.getAttribute('alt')).toBe('name')
    expect(wrapper.html()).toMatchSnapshot()
  })
})

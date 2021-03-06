import Vue from 'vue'
import { test } from '@util/testing'
import VTimePicker from '@components/VTimePicker'
import VMenu from '@components/VMenu'

function createMenuPicker(mount, props) {
  const wrapper = mount(Vue.component('test', {
    components: {
      VTimePicker,
      VMenu
    },
    render (h) {
      return h('v-menu', {
        props: { value: true },
        ref: 'menu'
      }, [h('v-time-picker', {
        props,
        ref: 'picker'
      })])
    }
  }))

  const menu = wrapper.vm.$refs.menu
  const picker = menu.$slots.default[0].context.$refs.picker

  expect('Unable to locate target [data-app]').toHaveBeenTipped()

  return { wrapper, menu, picker }
}

test('VTimePicker.js', ({ mount }) => {
  it('should accept a value', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:12:34'
      }
    })

    expect(wrapper.vm.selectingHour).toBe(true)
    expect(wrapper.vm.inputHour).toBe(9)
    expect(wrapper.vm.inputMinute).toBe(12)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render landscape component', function () {
    var wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:12:34',
        landscape: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component without a title', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:12:34',
        noTitle: true
      }
    })

    expect(wrapper.find('.picker__title')).toHaveLength(0)
  })

  it('should accept a date object for a value', () => {
    const now = new Date('2017-01-01 12:00 AM')
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: now
      }
    })

    expect(wrapper.vm.inputHour).toBe(0)
    expect(wrapper.vm.inputMinute).toBe(0)
    expect(wrapper.vm.period).toBe('am')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change am/pm when updated from model', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '9:00am'
      }
    })

    wrapper.setProps({ value: '9:00pm' })

    expect(wrapper.vm.period).toBe('pm')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set picker to pm when given Date after noon', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: new Date('2017-01-01 12:00 PM')
      }
    })

    expect(wrapper.vm.period).toBe('pm')
  })

  it('should set picker to pm when given string with PM in it', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '1:00 PM'
      }
    })

    expect(wrapper.vm.period).toBe('pm')
  })

  it('should set picker to pm when given string with pm in it', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '1:00 pm'
      }
    })

    expect(wrapper.vm.period).toBe('pm')
  })

  it('should set picker to am when given Date before noon', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: new Date('2017-01-01 1:00 AM')
      }
    })

    expect(wrapper.vm.period).toBe('am')
  })

  it('should reset selectingHour when saved/canceled', async () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.selectingHour = false
    wrapper.vm.save()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectingHour).toBe(true)
    wrapper.vm.selectingHour = false
    wrapper.vm.cancel()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectingHour).toBe(true)
  })

  it('should render colored time picker', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:00:00',
        color: 'primary',
        headerColor: 'orange darken-1'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render colored time picker', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '09:00:00',
        color: 'orange darken-1'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set input hour when setting hour', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '12:34'
      }
    })

    wrapper.vm.hour = 15
    expect(wrapper.vm.inputHour).toBe(15)
  })

  it('should set input minute when setting minute', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '12:34'
      }
    })

    wrapper.vm.minute = 15
    expect(wrapper.vm.inputMinute).toBe(15)
  })

  it('should set input hour when setting hour in 12hr mode', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '01:23pm',
        format: 'ampm'
      }
    })

    const clock = wrapper.vm.$refs.clock

    clock.$emit('input', 7)
    expect(wrapper.vm.inputHour).toBe(19)

    wrapper.setProps({ format: '24hr' })
    clock.$emit('input', 8)
    expect(wrapper.vm.inputHour).toBe(8)

    wrapper.vm.selectingHour = false
    clock.$emit('input', 33)
    expect(wrapper.vm.inputHour).toBe(8)
    expect(wrapper.vm.inputMinute).toBe(33)
  })

  it('should set properly input time', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        format: '24hr'
      }
    })

    expect(wrapper.vm.getInputTime('12:34am')).toEqual({ inputHour: 0, inputMinute: 34 })
    expect(wrapper.vm.getInputTime('7:34am').inputHour).toBe(7)
    expect(wrapper.vm.getInputTime('12:34pm').inputHour).toBe(12)
    expect(wrapper.vm.getInputTime('7:34pm').inputHour).toBe(19)
  })

  it('should update hour when changing period', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '15:34'
      }
    })

    wrapper.vm.period = 'am'
    expect(wrapper.vm.inputHour).toBe(3)
    wrapper.vm.period = 'pm'
    expect(wrapper.vm.inputHour).toBe(15)
  })

  it('should change selectingHour when hour is selected', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '01:23pm',
        format: 'ampm'
      }
    })

    const clock = wrapper.vm.$refs.clock

    clock.$emit('change')
    expect(wrapper.vm.selectingHour).toBe(false)
    clock.$emit('change')
    expect(wrapper.vm.selectingHour).toBe(false)
  })

  it('should change selectingHour when clicked in title', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '01:23pm',
        format: 'ampm'
      }
    })

    const title = wrapper.vm.$refs.title

    expect(wrapper.vm.selectingHour).toBe(true)
    title.$emit('update:selectingHour', false)
    expect(wrapper.vm.selectingHour).toBe(false)
    title.$emit('update:selectingHour', true)
    expect(wrapper.vm.selectingHour).toBe(true)
  })

  it('should change period when clicked in title', () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '01:23pm',
        format: 'ampm'
      }
    })

    const title = wrapper.vm.$refs.title

    expect(wrapper.vm.period).toBe('pm')
    title.$emit('update:period', 'am')
    expect(wrapper.vm.period).toBe('am')
    title.$emit('update:period', 'pm')
    expect(wrapper.vm.period).toBe('pm')
  })

  it('should toggle selectingHour on cancel in next tick', async () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '20:13',
      }
    })
    wrapper.vm.selectingHour = false
    wrapper.vm.cancel()
    expect(wrapper.vm.selectingHour).toBe(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectingHour).toBe(true)
  })

  it('should deactivate parent component on cancel', async () => {
    const { wrapper, menu, picker } = createMenuPicker(mount, { value: '20:13' })

    picker.selectingHour = false

    picker.$refs.clock.$emit('input', 17)
    picker.$refs.clock.$emit('change')
    await wrapper.vm.$nextTick()
    expect(menu.isActive).toBe(true)
    expect(picker.selectingHour).toBe(false)

    picker.cancel()
    await wrapper.vm.$nextTick()
    expect(picker.inputHour).toBe(20)
    expect(picker.inputMinute).toBe(13)
    expect(picker.selectingHour).toBe(true)
  })

  it('should deactivate parent component on cancel (no value provided)', async () => {
    const { wrapper, menu, picker } = createMenuPicker(mount, {})

    picker.selectingHour = false
    picker.$refs.clock.$emit('input', 17)
    picker.$refs.clock.$emit('change')
    await wrapper.vm.$nextTick()
    expect(menu.isActive).toBe(true)
    expect(picker.selectingHour).toBe(false)

    picker.cancel()
    await wrapper.vm.$nextTick()
    expect(picker.inputHour).toBe(undefined)
    expect(picker.inputMinute).toBe(undefined)
    expect(picker.selectingHour).toBe(true)
  })

  it('should update with autosave on minute click', async () => {
    const { wrapper, menu, picker } = createMenuPicker(mount, {
      value: '20:13',
      autosave: true
    })

    picker.selectingHour = false
    picker.$refs.clock.$emit('input', 23)
    expect(picker.originalMinute).toBe(13)
    picker.$refs.clock.$emit('change')
    expect(menu.isActive).toBe(false)
    expect(picker.originalMinute).toBe(23)
  })

  it('should update selectingHour in next tick on minute click (autosave)', async () => {
    const wrapper = mount(VTimePicker, {
      propsData: {
        value: '20:13',
        autosave: true
      }
    })

    wrapper.vm.selectingHour = false
    wrapper.vm.$refs.clock.$emit('change')
    expect(wrapper.vm.selectingHour).toBe(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectingHour).toBe(true)
  })

  it('should match snapshot with slot', async () => {
    const vm = new Vue()
    const slot = props => vm.$createElement('div', { class: 'scoped-slot' })
    const component = Vue.component('test', {
      components: {
        VTimePicker
      },
      render (h) {
        return h('v-time-picker', {
          props: {
            value: '10:12'
          },
          scopedSlots: {
            default: slot
          }
        })
      }
    })

    const wrapper = mount(component)
    expect(wrapper.find('.picker__actions .scoped-slot')).toHaveLength(1)
  })
})

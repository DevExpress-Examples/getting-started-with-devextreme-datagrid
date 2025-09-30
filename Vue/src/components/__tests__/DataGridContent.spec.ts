import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import DataGridContent from '../DataGridContent.vue';

describe('DataGridContent', () => {
  it('renders properly', () => {
    const wrapper = mount(DataGridContent);
    expect(wrapper.text()).toContain('DataGrid');
  });
});

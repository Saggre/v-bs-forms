import {
  getFormFields,
  getFormFieldGroups,
  validateFields,
  getValidationErrors,
} from '@/use/form';

describe('Form', () => {
  const form = {
    fields: {
      baz: {
        type: 'text',
        title: 'Baz',
        validate: () => ({
          valid: false,
          message: 'Baz is invalid',
        }),
      },
      section1: {
        type: 'group',
        fields: {
          foo: {
            type: 'text',
            title: 'Foo',
          },
        },
      },
      section2: {
        type: 'group',
        fields: {
          bar: {
            type: 'text',
            title: 'Bar',
          },
        },
      },
    },
  };

  it('Get form field groups', async () => {
    expect(getFormFieldGroups(form)).toEqual({
      section1: {
        type: 'group',
        fields: {
          foo: {
            type: 'text',
            title: 'Foo',
          },
        },
      },
      section2: {
        type: 'group',
        fields: {
          bar: {
            type: 'text',
            title: 'Bar',
          },
        },
      },
    });
  });

  it('Get form fields', async () => {
    expect(getFormFields(form)).toEqual({
      baz: form.fields.baz,
      foo: {
        type: 'text',
        title: 'Foo',
      },
      bar: {
        type: 'text',
        title: 'Bar',
      },
    });
  });

  it('Validate form fields', async () => {
    expect(validateFields(form)).toEqual({
      baz: {
        valid: false,
        message: 'Baz is invalid',
      },
    });
  });

  it('Get validation errors', async () => {
    const results = {
      foo: {
        valid: true,
      },
      bar: {
        valid: false,
        message: 'Bar is invalid',
      },
    };

    expect(getValidationErrors(results)).toEqual({
      bar: {
        valid: false,
        message: 'Bar is invalid',
      },
    });
  });
});

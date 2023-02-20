import { VueWrapper, mount } from "@vue/test-utils";
import Form from "@/components/Form.vue";
import { FormAccessors, FormCallbacks, useForm } from "@/use/form";

describe("Form", () => {
  describe(":props", () => {
    const data = {
      foo: "bar"
    };
    const errors = {};

    // @ts-ignore
    const wrapper = mount(Form, {
      props: {
        form: useForm({
          title: "Test form",
          description: "Test description",
          fields: {
            foo: {
              type: "text",
              title: "Foo",
              floating: true
            }
          },
          accessors: {
            data,
            errors
          },
          callbacks: {
            onSubmit: async (form) => {
              console.log("Submit");
            },
            onCancel: (form) => {
              console.log("Cancel");
            },
            onValidationError: (form) => {
              console.log("Validation error");
            }
          }
        })
      }
    });

    it(":initial-page renders at given page", async () => {
      expect(wrapper.find("form").exists()).toBe(true);

      const field = wrapper.get("input[type=\"text\"]");
      expect(field.element.value).toBe("bar");

      await field.setValue("baz");
      expect(field.element.value).toBe("baz");

      // trigger the element
      await wrapper.find('button[type="submit"]').trigger('click')

      // assert some action has been performed, like an emitted event.
      expect(wrapper.emitted()).toHaveProperty('submit')

      //wrapper.get("[data-test=\"new-todo\"]").setValue("New todo");
      //wrapper.get("[data-test=\"form\"]").trigger("submit");

      //const incrementEvent = wrapper.emitted('increment')

      // We have "clicked" twice, so the array of `increment` should
      // have two values.
      //expect(incrementEvent).toHaveLength(2)
    });

    it(":initial-page test", async () => {
      expect(true).toBe(true);
    });
  });
});

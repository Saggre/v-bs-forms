<template>
  <div class="px-4 px-sm-0">
    <div class="d-flex justify-content-between">
      <div>
        <h3 class="h5">
          <slot name="title" />
        </h3>

        <p class="mt-1 text-muted">
          <slot name="description" />
        </p>
      </div>

      <div>
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>

<template>
    <div id="app">
        <file-pond
            name="files"
            ref="pond"
            label-idle="Drop files here..."
            :allow-multiple="true"
            accepted-file-types="image/jpeg, image/png"
            v-bind:files="myFiles"
            v-on:init="handleFilePondInit"
        />
    </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond, { setOptions } from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export default {
    name: "VisiteIci",
    props: {
        virtualTourId: {
            type: String,
            default: "dzadza",
        },
    },
    data: function () {
        return { myFiles: [] };
    },
    methods: {
        handleFilePondInit: function () {
            console.log("FilePond has initialized");
            // FilePond instance methods are available on `this.$refs.pond`
        },
    },
    components: {
        FilePond,
    },
    mounted() {
        console.log("virtualTourId:", this.virtualTourId);
        setOptions({
            server: {
                url: "http://localhost:3001",
                process: {
                    url: "/pictures",
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": "CSFR-Token",
                        "Virtual-Tour-Id": this.virtualTourId,
                    },
                    withCredentials: false,
                    onload: (response) => response.key,
                    onerror: (response) => response.data,
                    allowMultiple: true,
                },
            },
        });
    },
};
</script>

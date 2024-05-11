<template>
    <div id="app">
        <div v-if="this.virtualTourId.key">
            <file-pond
                name="files"
                ref="pond"
                label-idle="Drop files here..."
                :allow-multiple="true"
                accepted-file-types="image/jpeg, image/png"
                v-bind:files="myFiles"
                maxParallelUploads="10"
                maxFiles="100"
                @init="handleFilePondInit"
                @initfile="handleInitFile"
                @processfile="handleFileUploaded"
                :allowImagePreview="false"
                imagePreviewMinHeight="44"
                imagePreviewMaxHeight="100"
            />
        </div>
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
import { isVirtualTourIdValide } from "~/validators/virtualTourId.validator";

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export default {
    name: "VisiteIci",
    props: {
        virtualTourId: {
            type: Object,
            require: true,
            validator: (propValue) => {
                return isVirtualTourIdValide(propValue);
            },
        },
    },
    data: function () {
        return { myFiles: [], numberOfFiles: 0, filesSuccessfullUploaded: 0};
    },
    methods: {
        handleFilePondInit: function () {
            console.log("FilePond has initialized");
            // FilePond instance methods are available on `this.$refs.pond`
        },
        handleInitFile() {
            console.log("handleInitFile");
            this.numberOfFiles++;
            console.log('file init', this.numberOfFiles)
        },
        handleFileUploaded() {
            console.log("handleFileUploaded");
            this.filesSuccessfullUploaded++;
            // go to route /virtualTour/:id where :id is the virtualTourId.key
            const virtualTourIdKey = this.virtualTourId.key;
            console.log('go to key : ', virtualTourIdKey)
            console.log(this.numberOfFiles);
            if(this.numberOfFiles === this.filesSuccessfullUploaded){
                this.$router.push(`/virtualTour/${virtualTourIdKey}`);
            }
        },
    },
    components: {
        FilePond,
    },
    mounted() {
        console.log("virtualTourId mounted : ", this.virtualTourId);
        setOptions({
            server: {
                url: "http://localhost:3001",
                process: {
                    url: "/pictures",
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": "CSFR-Token",
                        "Virtual-Tour-Id": this.virtualTourId.key,
                        "Virtual-Tour-Id-Checksum": this.virtualTourId.checksum,
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

import {ComponentCodeName, CountryCodeName} from './manifest/index.js';

__INDEX_IMPORTS_TARGET__;

const components = [__INDEX_EXPORTS_TARGET__];

const install = (Vue) => {
    if (install.installed) return;
    components.map((component) => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
};

export {__INDEX_EXPORTS_TARGET__};
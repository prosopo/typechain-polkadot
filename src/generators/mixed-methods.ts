/* eslint-disable indent */

import {readTemplate} from './_utils';
import Handlebars from "handlebars";
import {Import, Method} from "../types";

const generateForMetaTemplate = Handlebars.compile(readTemplate("mixed-methods"));

export const FILE = (fileName : string, methods : Method[], additionalImports: Import[]) => generateForMetaTemplate({fileName, methods, additionalImports});
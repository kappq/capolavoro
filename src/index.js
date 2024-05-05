import "./style.css";
import dataset from "./dataset.csv";

import Graph from "./data/graph";
import Visualization from "./visualization";

const graph = new Graph(dataset);
const visualization = new Visualization(graph);

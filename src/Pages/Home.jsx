import { useEffect,useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
 
import 'reactflow/dist/style.css';

const LOCAL_STORAGE_KEY_NODES = 'reactflow-nodes'
const LOCAL_STORAGE_KEY_EDGES = 'reactflow-edges'
 
const Home = () => {

    const initialNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES)) || []
    const initialEdges = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EDGES)) || []

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [nodeId, setNodeId] = useState(
        initialNodes.length 
        ?
        Math.max(...initialNodes.map(node => parseInt(node.id, 10))) + 1
        :
        1 
    )

    const [selectedNode, setSelectedNode] = useState(null)
    const [nodeTitle, setNodeTitle] = useState('')


    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(nodes))
    }, [nodes])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges))
    }, [edges])
   
    const onConnect = useCallback((params) => 
        setEdges((eds) => addEdge({...params, animated: true}, eds)),
      [setEdges],
    );

    const createNode = () => {
        const newNode = {
            id: `${nodeId}`,
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            data: {label: `Node ${nodeId}`},
        }
        setNodes((nds) => [...nds, newNode])
        setNodeId((id) => id + 1);
    }

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node)
        setNodeTitle(node.data.label)
    }, [])

    const handleTitleChange = (event) => {
        setNodeTitle(event.target.value)
    }   

    const handleTitleSave = () => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id ? { ...node, data: { ...node.data, label: nodeTitle } } : node
            )
        )
        setSelectedNode(null);
        setNodeTitle('');
    }

    return (
      <div className='h-screen w-screen'>
        <div className='p-4'>
            <button
                onClick={createNode}
                className='border
                 border-black 
                  rounded-lg 
                  px-2 py-1 
                  outline-none 
                  bg-black 
                  text-white 
                  font-semibold 
                  hover:bg-slate-700 '>
                Create node
            </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        {
            selectedNode && (
                <div className="absolute top-0 right-0 bg-white p-4 shadow-lg border">
                    <h3>Edit Node Title</h3>
                    <input 
                        type='text'
                        value={nodeTitle}
                        onChange={handleTitleChange}
                        className='border border-grey-300 p-2 rounded w-full'
                    />
                    <button
                        onClick={handleTitleSave}
                        className='mt-2 border border-black rounded-lg px-2 py-1 outline-none bg-black text-white font-semibold hover:bg-slate-700'
                    >
                        Save
                    </button>
                </div>
            )
        }
      </div>
    );
}

export default Home
import { useEffect,useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from 'reactflow';

import { FaCopy } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { RxCrossCircled } from "react-icons/rx"
 
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

    const handleCancelButton = () => {
        setSelectedNode(null)
    }

    const handleCopyText = () => {
        navigator.clipboard.writeText(nodeTitle)
        .then(() => {alert(`${nodeTitle} copied to clipboard`)})
        .catch((err) => {
            alert(`Failed to copy text: ${err}`)
        })
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
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        {
            selectedNode && (
                <div className="absolute top-10 right-10 bg-white p-4 shadow-lg border flex flex-col gap-4 w-76">
                    
                    <div className='flex gap-2 w-full h-8 items-center'>
                        <div className='w-full font-semibold'>
                            {nodeTitle}
                        </div>
                        <div className='flex gap-2 items-center cursor-pointer'>
                            <FaCopy 
                                onClick={handleCopyText}
                            />
                            <MdDelete />
                            <RxCrossCircled
                                onClick={handleCancelButton}
                            />
                        </div>
                    </div>

                    <div className='border border-gray-300'></div>

                    <div className='flex gap-2 justify-end'>
                        <button
                            onClick={handleCancelButton}
                            className='w-20
                                border
                                border-black 
                                rounded-lg 
                                px-2 py-1 
                                outline-none 
                                bg-white 
                                font-semibold 
                                hover:bg-slate-100'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleTitleSave}
                            className='w-20
                                border
                                border-black 
                                rounded-lg 
                                px-2 py-1 
                                outline-none 
                                bg-black 
                                text-white 
                                font-semibold 
                                hover:bg-slate-700 '
                        >
                            Save
                        </button>
                    </div>
                    <div></div>


                    <div className=''>
                        <input 
                            type='text'
                            value={nodeTitle}
                            onChange={handleTitleChange}
                            className='border border-grey-300 p-2 rounded w-full text-black font-medium'
                        />
                    </div>
                    
                </div>
            )
        }
      </div>
    );
}

export default Home
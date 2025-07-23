// src/components/common/DescriptionModal.jsx

import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.7); display: flex; align-items: center;
    justify-content: center; z-index: 2000;
`;
const ModalContent = styled.div`
    background: ${({ theme }) => theme.cardBg}; padding: 2rem;
    border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 100%; max-width: 700px; color: ${({ theme }) => theme.text};
    max-height: 85vh; display: flex; flex-direction: column;
`;
const ModalTitle = styled.h2`
    margin-top: 0; margin-bottom: 1rem; padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const MarkdownContainer = styled.div`
    overflow-y: auto;
    line-height: 1.7;

    // Add some basic styling for rendered markdown elements
    h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: none; }
    p { margin-bottom: 1rem; }
    ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }
    li { margin-bottom: 0.5rem; }
    code {
        background: ${({ theme }) => theme.body};
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        border-radius: 6px;
        font-family: 'Courier New', Courier, monospace;
    }
    pre > code { display: block; padding: 1rem; white-space: pre-wrap; }
    blockquote {
        border-left: 4px solid ${({ theme }) => theme.borderColor};
        padding-left: 1rem;
        margin-left: 0;
        color: ${({ theme }) => theme.text}99;
    }
    table {
        width: 100%; border-collapse: collapse; margin-bottom: 1rem;
    }
    th, td {
        border: 1px solid ${({ theme }) => theme.borderColor};
        padding: 0.5rem;
    }
    th { background: ${({ theme }) => theme.body}; }
`;

const DescriptionModal = ({ isOpen, onClose, milestone }) => {
    if (!isOpen || !milestone) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>{milestone.name}</ModalTitle>
                <MarkdownContainer>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {milestone.description || '*No description provided.*'}
                    </ReactMarkdown>
                </MarkdownContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default DescriptionModal;
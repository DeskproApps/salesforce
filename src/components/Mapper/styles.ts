import styled from "styled-components";

export const Container = styled.div`
    width: 100%;  
`;

export const Layout = styled.div`
    border: 1px dashed ${({ theme }) => theme.colors.brandShade50};
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    padding: 3px 0;
`;

export const Row = styled.div`
    display: flex;
    width: 100%;
    gap: 6px;
    padding: 0 5px;
    box-sizing: border-box;
`;

export const ItemOrderDrop = styled.div<{ isOver: boolean; }>`
    height: 3px;
    transition: max-height 0.1s ease-out;
    overflow: hidden;
    background-color: none;
    ${({ isOver }) => isOver && "height: 42px; transition: height 0.1s ease-in;"}
`;

export const ItemOrderDropDummy = styled.div`
    height: 3px;
    overflow: hidden;
    background-color: none;
`;

export const ItemPlaceholder = styled.div<{ isOver: boolean; }>`
    border-radius: 4px;
    border: 1px solid transparent;
    background-color: ${({ theme, isOver }) => isOver ? theme.colors.brandShade40 : theme.colors.brandShade10};
    font-size: 12px;
    width: 100%;
    margin: 3px 0;
    height: 29px;
`;

export const Item = styled.div<{ isDragging: boolean; }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid ${({ theme }) => theme.colors.brandShade50};
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.white};
    font-size: 12px;
    height: 31px;
    box-sizing: border-box;
    .grab {
        cursor: grab;
    }
    .trash {
        display: none;
        cursor: pointer;
    }
    &:hover .trash {
        display: inline;
    }
`;

export const EmptyMessage = styled.div`
    padding: 3px 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.grey40};
`;

export const ItemWrapper = styled.div`
    width: 100%;
`;

export const ItemStart = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
    color: ${({ theme }) => theme.colors.grey100};
`;

export const ItemEnd = styled.div`
    display: flex;
    align-items: center;
`;

export const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
`;

export const ControlsStart = styled.div`
    
`;

export const ControlsEnd = styled.div`
    
`;

export const Control = styled.div`
    display: flex;
    align-items: center;
`;

export const ControlLabel = styled.label`
    font-size: 12px;
    margin-right: 6px;
`;

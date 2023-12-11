import styled from "styled-components";
import type { CSSProperties } from "react";
import type { FC, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  marginBottom?: number;
  style?: CSSProperties;
}>;

type RowProps = Pick<Props, "marginBottom"> & {
  count: number;
};

const Row = styled.div<RowProps>`
  display: grid;
  grid-template-columns: repeat(
    ${({ count }) => count},
    ${({ count }) => 100 / count}%
  );
  width: 100%;
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const ItemContainer = styled.div`
  padding: 0 6px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &:not(:first-child) {
    border-left: 1px solid ${({ theme }) => theme.colors.grey20};
  }
`;

const Item = styled.div`
  overflow: hidden;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

export const PropertyRow: FC<Props> = ({
  style,
  children,
  marginBottom = 10,
}) => {
  const filteredChildren = !Array.isArray(children)
    ? children
    : children.filter(Boolean);

  return !Array.isArray(filteredChildren) ? (
    <div style={style}>{filteredChildren}</div>
  ) : (
    <Row
      count={filteredChildren.length}
      marginBottom={marginBottom}
      style={style}
    >
      {filteredChildren.map((child, idx) => (
        <ItemContainer key={idx}>
          <Item>{child}</Item>
        </ItemContainer>
      ))}
    </Row>
  );
};

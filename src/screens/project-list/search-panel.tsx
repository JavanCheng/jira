/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { Form, Input } from "antd";
import { UserSelect } from "components/user-select";
import { Project } from "./list";

export interface User {
  id: number;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}

interface SearchPanelProps {
  // users 是 User 类型的数组
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  // setParam 是一个函数，返回值为空（void），参数是 param
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form css={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        {/* 当value的值发生改变时，setParam更新params的值
            首先扩展运算符将原始params保留
            然后evt.target.value获取改变的evt对应type的value */}
        <Input
          placeholder={"项目名"}
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};

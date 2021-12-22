// import { useState } from "react";

export const SearchPanel = ({users,param, setParam}) => {

    return <form>
        <div>
            {/* 当value的值发生改变时，setParam更新params的值
            首先扩展运算符将原始params保留
            然后evt.target.value获取改变的evt对应type的value */}
            <input type="text" value={param.name} onChange={evt => setParam({
                ...param,
                name: evt.target.value
            })}/>
            <select value={param.personId} onChange={evt => setParam({
                ...param,
                personId: evt.target.value
            })}>
                <option value={''}>负责人</option>
                {
                    users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)
                }
            </select>
        </div>
    </form>
}
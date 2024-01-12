import styles from '../../styles/Loading.module.css'
import {Spinner} from "@nextui-org/react";

const Loading = () => {
    return (
        <>
            <div className={styles.loadingContainer}>
                <Spinner label="Authenticating..." color="secondary" />
            </div>
        </>
    )
}

export default Loading;
import styles from '../../styles/Loading.module.css'
import {Spinner} from "@nextui-org/react";

const Loading = ({ loadingString }) => {
    return (
        <>
            <div className={styles.loadingContainer}>
                <Spinner label={loadingString} color="secondary" />
            </div>
        </>
    )
}

export default Loading;